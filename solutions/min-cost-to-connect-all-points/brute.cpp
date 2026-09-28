class Solution {
    int find(vector<int>& p, int x) {
        while (p[x] != x) { p[x] = p[p[x]]; x = p[x]; }
        return x;
    }
public:
    int minCostConnectPoints(vector<vector<int>>& points) {
        int n = points.size();
        vector<array<int, 3>> edges;                        // every pair
        for (int i = 0; i < n; i++)
            for (int j = i + 1; j < n; j++)
                edges.push_back({abs(points[i][0] - points[j][0]) + abs(points[i][1] - points[j][1]), i, j});
        sort(edges.begin(), edges.end());
        vector<int> parent(n);
        iota(parent.begin(), parent.end(), 0);
        int total = 0, used = 0;
        for (auto& [w, i, j] : edges) {
            int a = find(parent, i), b = find(parent, j);
            if (a == b) continue;                           // would close a cycle
            parent[a] = b;
            total += w;
            if (++used == n - 1) break;
        }
        return total;
    }
};
