class Solution {
    public boolean searchMatrix(int[][] matrix, int target) {
        for (int[] row : matrix)
            for (int x : row) if (x == target) return true;
        return false;
    }
}
