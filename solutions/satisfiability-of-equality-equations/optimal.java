class Solution {
    private final int[] parent = new int[26];

    private int find(int x) {
        while (parent[x] != x) {
            parent[x] = parent[parent[x]];
            x = parent[x];
        }
        return x;
    }

    public boolean equationsPossible(String[] equations) {
        for (int i = 0; i < 26; i++) parent[i] = i;
        for (String e : equations)                        // pass 1: build the groups
            if (e.charAt(1) == '=') parent[find(e.charAt(0) - 'a')] = find(e.charAt(3) - 'a');
        for (String e : equations)                        // pass 2: check the inequalities
            if (e.charAt(1) == '!' && find(e.charAt(0) - 'a') == find(e.charAt(3) - 'a')) return false;
        return true;
    }
}
