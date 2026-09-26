class Solution {
public:
    vector<int> spiralOrder(vector<vector<int>>& matrix) {
        int m = matrix.size(), n = matrix[0].size();
        vector<vector<bool>> seen(m, vector<bool>(n, false));
        int dr[] = {0, 1, 0, -1}, dc[] = {1, 0, -1, 0};    // right, down, left, up
        vector<int> out;
        int r = 0, c = 0, d = 0;
        for (int k = 0; k < m * n; k++) {
            out.push_back(matrix[r][c]);
            seen[r][c] = true;
            int nr = r + dr[d], nc = c + dc[d];
            if (nr < 0 || nr >= m || nc < 0 || nc >= n || seen[nr][nc]) {
                d = (d + 1) % 4;                            // turn right
                nr = r + dr[d];
                nc = c + dc[d];
            }
            r = nr;
            c = nc;
        }
        return out;
    }
};
