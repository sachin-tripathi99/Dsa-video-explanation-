class Solution {
public:
    int minCostConnectPoints(vector<vector<int>>& points) {
        int n = points.size();
        vector<int> best(n, INT_MAX);                       // cheapest link from the tree
        vector<bool> inTree(n, false);
        best[0] = 0;
        int total = 0;
        for (int k = 0; k < n; k++) {
            int u = -1;
            for (int i = 0; i < n; i++) if (!inTree[i] && (u < 0 || best[i] < best[u])) u = i;
            inTree[u] = true;
            total += best[u];
            for (int i = 0; i < n; i++)
                if (!inTree[i]) best[i] = min(best[i], abs(points[u][0] - points[i][0]) + abs(points[u][1] - points[i][1]));
        }
        return total;
    }
};
