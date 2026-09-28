class Solution {
    vector<pair<int, int>> cost;
    int best(int i, int z, int o) {
        if (i == (int)cost.size()) return 0;
        int res = best(i + 1, z, o);                        // skip
        auto [zs, os] = cost[i];
        if (zs <= z && os <= o) res = max(res, 1 + best(i + 1, z - zs, o - os));   // take
        return res;
    }
public:
    int findMaxForm(vector<string>& strs, int m, int n) {
        for (auto& s : strs) { int z = count(s.begin(), s.end(), '0'); cost.push_back({z, (int)s.size() - z}); }
        return best(0, m, n);
    }
};
