class Solution {
public:
    bool searchMatrix(vector<vector<int>>& matrix, int target) {
        int m = matrix.size(), n = matrix[0].size();
        int lo = 0, hi = m * n - 1;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            int x = matrix[mid / n][mid % n];            // virtual index → (row, col)
            if (x == target) return true;
            if (x < target) lo = mid + 1; else hi = mid - 1;
        }
        return false;
    }
};
