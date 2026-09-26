class Solution {
    public int findCircleNum(int[][] isConnected) {
        int n = isConnected.length, provinces = 0;
        boolean[] seen = new boolean[n];
        for (int c = 0; c < n; c++) {
            if (seen[c]) continue;
            provinces++;
            Deque<Integer> stack = new ArrayDeque<>();
            stack.push(c);
            seen[c] = true;
            while (!stack.isEmpty()) {
                int x = stack.pop();
                for (int j = 0; j < n; j++)
                    if (isConnected[x][j] == 1 && !seen[j]) { seen[j] = true; stack.push(j); }
            }
        }
        return provinces;
    }
}
