class Solution {
    public void solve(char[][] board) {
        int m = board.length, n = board[0].length;
        List<int[]> capture = new ArrayList<>();
        for (int r = 0; r < m; r++)
            for (int c = 0; c < n; c++)
                if (board[r][c] == 'O' && !escapes(board, r, c)) capture.add(new int[]{r, c});   // fresh search per cell
        for (int[] p : capture) board[p[0]][p[1]] = 'X';
    }

    private boolean escapes(char[][] b, int sr, int sc) {
        int m = b.length, n = b[0].length;
        boolean[][] seen = new boolean[m][n];
        Deque<int[]> q = new ArrayDeque<>();
        q.offer(new int[]{sr, sc});
        seen[sr][sc] = true;
        int[][] dirs = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
        while (!q.isEmpty()) {
            int[] p = q.poll();
            if (p[0] == 0 || p[1] == 0 || p[0] == m - 1 || p[1] == n - 1) return true;
            for (int[] d : dirs) {
                int r = p[0] + d[0], c = p[1] + d[1];
                if (r < 0 || c < 0 || r >= m || c >= n || seen[r][c] || b[r][c] != 'O') continue;
                seen[r][c] = true;
                q.offer(new int[]{r, c});
            }
        }
        return false;
    }
}
