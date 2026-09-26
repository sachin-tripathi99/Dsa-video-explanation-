class Solution {
    public boolean searchMatrix(int[][] matrix, int target) {
        int lo = 0, hi = matrix.length - 1;
        while (lo < hi) {                                // last row whose first element <= target
            int mid = lo + (hi - lo + 1) / 2;
            if (matrix[mid][0] <= target) lo = mid; else hi = mid - 1;
        }
        return Arrays.binarySearch(matrix[lo], target) >= 0;
    }
}
