class Solution {
    public List<Integer> eventualSafeNodes(int[][] graph) {
        int n = graph.length;
        List<Integer> res = new ArrayList<>();
        for (int s = 0; s < n; s++)                         // a fresh search from every node
            if (!loops(graph, s, new boolean[n], new boolean[n])) res.add(s);
        return res;
    }

    private boolean loops(int[][] g, int u, boolean[] onPath, boolean[] clear) {
        if (onPath[u]) return true;                         // back into the current path
        if (clear[u]) return false;                         // already explored in this search
        onPath[u] = true;
        for (int w : g[u]) if (loops(g, w, onPath, clear)) return true;
        onPath[u] = false;
        clear[u] = true;
        return false;
    }
}
