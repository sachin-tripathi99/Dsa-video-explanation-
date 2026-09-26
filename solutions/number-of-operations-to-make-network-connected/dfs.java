class Solution {
    public int makeConnected(int n, int[][] connections) {
        if (connections.length < n - 1) return -1;          // not enough cables in total
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
        for (int[] c : connections) { adj.get(c[0]).add(c[1]); adj.get(c[1]).add(c[0]); }
        boolean[] seen = new boolean[n];
        int components = 0;
        for (int s = 0; s < n; s++) {
            if (seen[s]) continue;
            components++;
            Deque<Integer> stack = new ArrayDeque<>();
            stack.push(s);
            seen[s] = true;
            while (!stack.isEmpty()) {
                int x = stack.pop();
                for (int y : adj.get(x)) if (!seen[y]) { seen[y] = true; stack.push(y); }
            }
        }
        return components - 1;
    }
}
