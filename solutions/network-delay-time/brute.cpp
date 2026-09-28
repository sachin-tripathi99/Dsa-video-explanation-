class Solution {
public:
    int networkDelayTime(vector<vector<int>>& times, int n, int k) {
        vector<int> dist(n + 1, INT_MAX);
        dist[k] = 0;
        for (int round = 1; round < n; round++)             // n − 1 passes
            for (auto& t : times)
                if (dist[t[0]] != INT_MAX && dist[t[0]] + t[2] < dist[t[1]]) dist[t[1]] = dist[t[0]] + t[2];
        int best = 0;
        for (int v = 1; v <= n; v++) {
            if (dist[v] == INT_MAX) return -1;
            best = max(best, dist[v]);
        }
        return best;
    }
};
