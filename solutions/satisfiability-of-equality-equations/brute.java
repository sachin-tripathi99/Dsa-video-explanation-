class Solution {
    public boolean equationsPossible(String[] equations) {
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < 26; i++) adj.add(new ArrayList<>());
        for (String e : equations)
            if (e.charAt(1) == '=') {
                int x = e.charAt(0) - 'a', y = e.charAt(3) - 'a';
                adj.get(x).add(y);
                adj.get(y).add(x);
            }
        for (String e : equations)
            if (e.charAt(1) == '!' && reaches(adj, e.charAt(0) - 'a', e.charAt(3) - 'a')) return false;
        return true;
    }

    private boolean reaches(List<List<Integer>> adj, int from, int to) {
        boolean[] seen = new boolean[26];
        Deque<Integer> q = new ArrayDeque<>();
        q.offer(from);
        seen[from] = true;
        while (!q.isEmpty()) {
            int u = q.poll();
            if (u == to) return true;
            for (int w : adj.get(u)) if (!seen[w]) { seen[w] = true; q.offer(w); }
        }
        return false;
    }
}
