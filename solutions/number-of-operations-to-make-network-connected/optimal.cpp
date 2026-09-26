class Solution {
    vector<int> parent, sz;

    int find(int x) {
        while (parent[x] != x) {
            parent[x] = parent[parent[x]];
            x = parent[x];
        }
        return x;
    }
public:
    int makeConnected(int n, vector<vector<int>>& connections) {
        parent.resize(n);
        sz.assign(n, 1);
        iota(parent.begin(), parent.end(), 0);
        int components = n, spare = 0;
        for (auto& c : connections) {
            int ra = find(c[0]), rb = find(c[1]);
            if (ra == rb) { spare++; continue; }         // already connected: a cable we can move
            if (sz[ra] < sz[rb]) swap(ra, rb);
            parent[rb] = ra;
            sz[ra] += sz[rb];
            components--;
        }
        return spare >= components - 1 ? components - 1 : -1;
    }
};
