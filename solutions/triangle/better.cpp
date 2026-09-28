class Solution {
    vector<vector<int>> memo;
    vector<vector<bool>> seen;
    int best(vector<vector<int>>& t, int r, int c) {
        if (r == (int)t.size() - 1) return t[r][c];
        if (seen[r][c]) return memo[r][c];                  // solved before
        seen[r][c] = true;
        return memo[r][c] = t[r][c] + min(best(t, r + 1, c), best(t, r + 1, c + 1));
    }
public:
    int minimumTotal(vector<vector<int>>& triangle) {
        int n = triangle.size();
        memo.assign(n, vector<int>(n, 0));
        seen.assign(n, vector<bool>(n, false));
        return best(triangle, 0, 0);
    }
};
