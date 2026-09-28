class Solution {
    vector<vector<int>> memo;
    int need(vector<vector<int>>& d, int r, int c) {
        int R = d.size(), C = d[0].size();
        if (r >= R || c >= C) return INT_MAX;
        if (memo[r][c]) return memo[r][c];                  // solved before (need ≥ 1)
        int next = (r == R - 1 && c == C - 1) ? 1 : min(need(d, r + 1, c), need(d, r, c + 1));
        return memo[r][c] = max(1, next - d[r][c]);
    }
public:
    int calculateMinimumHP(vector<vector<int>>& dungeon) {
        memo.assign(dungeon.size(), vector<int>(dungeon[0].size(), 0));
        return need(dungeon, 0, 0);
    }
};
