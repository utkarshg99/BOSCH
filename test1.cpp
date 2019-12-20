#include<bits/stdc++.h>
using namespace std;
#define ll long long
#define dd double
#define endl "\n"
#define pb push_back
#define all(v) v.begin(),v.end()
#define mp make_pair
#define fi first
#define se second
#define fo(i,n) for(int i=0;i<n;i++)
#define fo1(i,n) for(int i=1;i<=n;i++)
ll mod=1000000007;
ll n,k,t,m,q,flag=0;
ll po(ll k ,ll n,ll ans,ll temp,ll ans1){
    if(n==0)return ans;
    while(temp<=n){
        ans*=ans1;ans%=mod;ans1=ans1*ans1;ans1%=mod;n=n-temp;temp*=2;
    }
    return po(k,n,ans,1,k)%mod;

    //eg. po(2,78,1,1,2);
}
ll min(ll a,ll b){if(a>b)return b;else return a;}
ll max(ll a,ll b){if(a>b)return a;else return b;}
int main() {
    ios_base::sync_with_stdio(0);
    cin.tie(0); cout.tie(0);

    freopen("distances.csv", "r", stdin);
    freopen("ordered.csv", "w", stdout);

    int t1;
    cin>>t1;
    cout<<t1<<endl;
    //t=1;
    char sep = ',';
    for(int t=1;t<=t1;t++){
        cin>>n;
        n--;
        pair<dd,dd>p[n+1];
        fo(i,n+1){
            dd a,b;
            cin>>a>>sep>>b;
            p[i]=mp(a,b);
        }
        ll dist[n+1][n+1];
        fo(i,n+1)
            fo(j,n+1) {
                
                if (j == n) {
                    cin >> dist[i][j];
                }
                else {
                    cin>>dist[i][j]>>sep;
                }
            }
        vector<ll>dp[n+1][n+1];
        fo1(i,n)dp[1][i].pb(i);

        for(int i=2;i<=n;i++){
            for(int k=1;k<=n;k++){
                ll temp=0;
                ll tempsum=mod;
                flag=0;
                for(int j=1;j<=n;j++){
                    //cout<<k<<" "<<j<<endl;
                    if(dp[i-1][j].size()<i-1)continue;
                    ll sum=0;
                    flag=0;
                    sum+=dist[0][dp[i-1][j][0]];
                    for(int l=0;l<i-2;l++){
                        if(dp[i-1][j][l]==k)flag=1;
                        sum+=dist[dp[i-1][j][l]][dp[i-1][j][l+1]];
                    }
                    //cout<<i<<" "<<k<<" "<<dp[i-1][j][i-2]<<endl;
                    if(dp[i-1][j][i-2]==k)flag=1;
                    if(flag)continue;
                    sum+=dist[dp[i-1][j][i-2]][k];
                    if(tempsum>sum)tempsum=sum,temp=j;
                }
                //cout<<k<<" "<<temp<<endl;
                dp[i][k]=dp[i-1][temp];
                dp[i][k].pb(k);
            }
        }
        // fo1(i,n)fo1(j,n){
        //     fo(l,dp[i][j].size())cout<<dp[i][j][l]<<" ";
        //     cout<<endl;
        // }
        vector<ll>v;
        ll ans=mod;
        fo1(i,n){
            ll sum=dist[0][dp[n][i][0]];
            fo(j,n-1){
                sum+=dist[dp[n][i][j]][dp[n][i][j+1]];
            }
            if(sum<ans && dp[n][i].size()==n)ans=sum,v=dp[n][i];
        }
        
        
        cout << n + 1 << endl;
        cout<<p[0].fi<< ", " <<p[0].se<<endl;
        fo(i,n)cout<<p[v[i]].fi<<", "<<p[v[i]].se<<endl;



        
    }

    return 0;
}
