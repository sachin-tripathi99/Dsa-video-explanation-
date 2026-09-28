class Solution {
    public int shortestPathLength(int[][] graph) {
        int n = graph.length, full = (1 << n) - 1;
        boolean[][] seen = new boolean[n][1 << n];
        Deque<int[]> q = new ArrayDeque<>();
        for (int i = 0; i < n; i++) { q.offer(new int[]{i, 1 << i}); seen[i][1 << i] = true; }   // start anywhere
        for (int d = 0; !q.isEmpty(); d++)
            for (int k = q.size(); k > 0; k--) {
                int[] s = q.poll();
                if (s[1] == full) return d;                 // everything visited
                for (int w : graph[s[0]]) {
                    int nm = s[1] | (1 << w);
                    if (!seen[w][nm]) { seen[w][nm] = true; q.offer(new int[]{w, nm}); }
                }
            }
        return -1;
    }
}
