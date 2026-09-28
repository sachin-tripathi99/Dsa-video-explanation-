class Solution {
public:
    int findCheapestPrice(int n, vector<vector<int>>& flights, int src, int dst, int k) {
        vector<int> cost(n, INT_MAX);
        cost[src] = 0;
        for (int round = 0; round <= k; round++) {          // k + 1 flights at most
            vector<int> prev = cost;                        // read only last round's prices
            for (auto& f : flights)
                if (prev[f[0]] != INT_MAX && prev[f[0]] + f[2] < cost[f[1]]) cost[f[1]] = prev[f[0]] + f[2];
        }
        return cost[dst] == INT_MAX ? -1 : cost[dst];
    }
};
