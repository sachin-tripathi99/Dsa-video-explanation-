class Solution {
    private final List<List<String>> out = new ArrayList<>();
    private boolean[][] pal;

    public List<List<String>> partition(String s) {
        int n = s.length();
        pal = new boolean[n][n];
        for (int len = 1; len <= n; len++)                  // shorter pieces first
            for (int i = 0; i + len - 1 < n; i++) {
                int j = i + len - 1;
                pal[i][j] = s.charAt(i) == s.charAt(j) && (j - i < 2 || pal[i + 1][j - 1]);
            }
        go(s, 0, new ArrayList<>());
        return out;
    }

    private void go(String s, int i, List<String> path) {
        if (i == s.length()) { out.add(new ArrayList<>(path)); return; }
        for (int j = i; j < s.length(); j++) {
            if (!pal[i][j]) continue;                       // O(1) lookup
            path.add(s.substring(i, j + 1));
            go(s, j + 1, path);
            path.remove(path.size() - 1);
        }
    }
}
