class Solution {
    public int kthSmallest(int[][] matrix, int k) {
        int n = matrix.length;
        PriorityQueue<int[]> heap = new PriorityQueue<>((a, b) -> Integer.compare(matrix[a[0]][a[1]], matrix[b[0]][b[1]]));   // (row, col)
        for (int r = 0; r < n; r++) heap.offer(new int[]{r, 0});
        for (int t = 1; t < k; t++) {
            int[] top = heap.poll();
            if (top[1] + 1 < n) heap.offer(new int[]{top[0], top[1] + 1});   // next in the same row
        }
        int[] top = heap.peek();
        return matrix[top[0]][top[1]];
    }
}
