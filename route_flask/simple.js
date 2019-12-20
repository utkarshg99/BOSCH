// var urlServer = 'ec2-34-227-87-231.compute-1.amazonaws.com';
var urlServer = 'http://localhost:8000'

function generateClusterJSON(rows){
    return {
        "data": rows,
        "length": rows.length
    }
    // the dimension of the matrix acccessed from "data" will be ("length", 2)
}

async function findDistance(pt1, pt2){
    let stp1 = pt1[0]+','+pt1[1];
    let stp2 = pt2[0]+','+pt2[1];
    let params = {
        mode: "fastest;car;traffic:enabled",
        waypoint0: stp1,
        waypoint1: stp2,
        representation: "display",
        routeAttributes: "summary"
    };
    let promx, distance;
    // find routingService
    promx = new Promise(function(resolve, reject){
        routingService.calculateRoute(params, (success)=>{
            distance=success.response.route[0].summary.distance;
            resolve();
        }, (error)=>{
            console.log(error);
            reject();
        });
    })
    await promx;
    return distance;
}

async function calculateDistances(clusters){
    var dist = [];
    for(var i=0; i<clusters.length; i++){
        let cluster = clusters[i];
        let y = [];
        for(var j=0; j<cluster.length; j++){
            let x=[];
            for(var k=0; k<cluster.length; k++){
                x.push(0);
            }
            y.push(x);
        }
        dist.push(y);
    }
    for(var i=0; i<clusters.length; i++){
        let cluster = clusters[i];
        for(var j=0; j<cluster.length; j++){
            for(var k=0; k<cluster.length; k++){
                dist[i][j][k] = await findDistance(cluster[j], cluster[k]);
            }
        }
    }
}

function generateDistanceJSON(clusters, dist){
    let clen = [];
    for(var i=0; i<dist.length; i++){
        clen.append(dist[i].length);
    }
    return {
        "data": dist,
        clusters,
        "nclusters": dist.length,
        clen
    }
}

async function worker(){
    let urlCluster = urlServer + '/uploadPoints';
    // console.log(generateClusterJSON(rows))
    var clusters = (await axios.post(urlCluster, generateClusterJSON(rows))).data;
    var dist = await calculateDistances(clusters);
    let urlDistance = urlServer + '/uploadDistances';
    let dstx = generateDistanceJSON(clusters, dist);
    var someResult = await (axios.post(urlDistance, dstx)).data;
    return someResult;
}