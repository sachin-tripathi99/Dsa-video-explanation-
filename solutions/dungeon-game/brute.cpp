class Solution {
    int need(vector<vector<int>>& d, int r, int c) {        // health needed on entering (r, c)
        int R = d.size(), C = d[0].size();
        if (r >= R || c >= C) return INT_MAX;
        int next = (r == R - 1 && c == C - 1) ? 1 : min(need(d, r + 1, c), need(d, r, c + 1));
        return max(1, next - d[r][c]);
    }
public:
    int calculateMinimumHP(vector<vector<int>>& dungeon) {
        return need(dungeon, 0, 0);
    }
};
