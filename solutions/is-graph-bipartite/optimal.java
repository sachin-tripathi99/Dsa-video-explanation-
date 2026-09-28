class Solution {
    public boolean isBipartite(int[][] graph) {
        int n = graph.length;
        int[] col = new int[n];
        Arrays.fill(col, -1);
        for (int s = 0; s < n; s++) {                       // every component
            if (col[s] != -1) continue;
            col[s] = 0;
            Deque<Integer> q = new ArrayDeque<>();
            q.offer(s);
            while (!q.isEmpty()) {
                int x = q.poll();
                for (int y : graph[x]) {
                    if (col[y] == -1) { col[y] = 1 - col[x]; q.offer(y); }   // forced colour
                    else if (col[y] == col[x]) return false;                 // conflict
                }
            }
        }
        return true;
    }
}
