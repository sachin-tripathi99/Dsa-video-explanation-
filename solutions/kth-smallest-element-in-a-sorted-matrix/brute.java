class Solution {
    public int kthSmallest(int[][] matrix, int k) {
        int n = matrix.length;
        int[] all = new int[n * n];
        for (int i = 0; i < n; i++) for (int j = 0; j < n; j++) all[i * n + j] = matrix[i][j];
        Arrays.sort(all);
        return all[k - 1];
    }
}
