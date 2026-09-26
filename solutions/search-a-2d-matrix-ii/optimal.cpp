class Solution {
public:
    bool searchMatrix(vector<vector<int>>& matrix, int target) {
        int r = 0, c = matrix[0].size() - 1;             // top-right corner
        while (r < (int)matrix.size() && c >= 0) {
            int x = matrix[r][c];
            if (x == target) return true;
            if (x > target) c--;                          // column below is all bigger
            else r++;                                     // row to the left is all smaller
        }
        return false;
    }
};
