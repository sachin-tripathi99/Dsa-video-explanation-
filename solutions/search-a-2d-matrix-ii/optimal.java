class Solution {
    public boolean searchMatrix(int[][] matrix, int target) {
        int r = 0, c = matrix[0].length - 1;             // top-right corner
        while (r < matrix.length && c >= 0) {
            int x = matrix[r][c];
            if (x == target) return true;
            if (x > target) c--;                          // column below is all bigger
            else r++;                                     // row to the left is all smaller
        }
        return false;
    }
}
