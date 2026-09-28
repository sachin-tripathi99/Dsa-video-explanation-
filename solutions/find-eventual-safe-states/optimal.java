class Solution {
    public List<Integer> eventualSafeNodes(int[][] graph) {
        int n = graph.length;
        List<List<Integer>> rev = new ArrayList<>();
        for (int i = 0; i < n; i++) rev.add(new ArrayList<>());
        int[] out = new int[n];
        for (int x = 0; x < n; x++) {
            out[x] = graph[x].length;
            for (int y : graph[x]) rev.get(y).add(x);       // reversed arrows
        }
        Deque<Integer> q = new ArrayDeque<>();
        for (int x = 0; x < n; x++) if (out[x] == 0) q.offer(x);   // terminal = safe
        boolean[] safe = new boolean[n];
        while (!q.isEmpty()) {
            int y = q.poll();
            safe[y] = true;
            for (int x : rev.get(y)) if (--out[x] == 0) q.offer(x);
        }
        List<Integer> res = new ArrayList<>();
        for (int x = 0; x < n; x++) if (safe[x]) res.add(x);
        return res;
    }
}
