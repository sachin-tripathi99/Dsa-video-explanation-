class Solution {
    public int findCircleNum(int[][] isConnected) {
        int n = isConnected.length;
        int[] group = new int[n];
        for (int i = 0; i < n; i++) group[i] = i;
        for (int i = 0; i < n; i++)
            for (int j = i + 1; j < n; j++)
                if (isConnected[i][j] == 1 && group[i] != group[j]) {
                    int old = group[j], now = group[i];
                    for (int k = 0; k < n; k++) if (group[k] == old) group[k] = now;   // O(n) relabel
                }
        Set<Integer> labels = new HashSet<>();
        for (int g : group) labels.add(g);
        return labels.size();
    }
}
