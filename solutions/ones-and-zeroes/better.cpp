class Solution {
    vector<pair<int, int>> cost;
    vector<vector<vector<int>>> memo;
    int best(int i, int z, int o) {
        if (i == (int)cost.size()) return 0;
        int& mm = memo[i][z][o];
        if (mm != -1) return mm;                            // solved before
        int res = best(i + 1, z, o);
        auto [zs, os] = cost[i];
        if (zs <= z && os <= o) res = max(res, 1 + best(i + 1, z - zs, o - os));
        return mm = res;
    }
public:
    int findMaxForm(vector<string>& strs, int m, int n) {
        for (auto& s : strs) { int z = count(s.begin(), s.end(), '0'); cost.push_back({z, (int)s.size() - z}); }
        memo.assign(strs.size(), vector<vector<int>>(m + 1, vector<int>(n + 1, -1)));
        return best(0, m, n);
    }
};
