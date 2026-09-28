class Solution {
    int best(vector<vector<int>>& t, int r, int c) {
        if (r == (int)t.size() - 1) return t[r][c];         // bottom row
        return t[r][c] + min(best(t, r + 1, c), best(t, r + 1, c + 1));
    }
public:
    int minimumTotal(vector<vector<int>>& triangle) {
        return best(triangle, 0, 0);
    }
};
