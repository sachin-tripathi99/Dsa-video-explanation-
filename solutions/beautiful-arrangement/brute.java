class Solution {
    private int count = 0;

    public int countArrangement(int n) {
        int[] perm = new int[n];
        for (int i = 0; i < n; i++) perm[i] = i + 1;
        permute(perm, 0);
        return count;
    }

    private void permute(int[] p, int k) {                  // every permutation
        if (k == p.length) {
            for (int i = 0; i < p.length; i++) if (p[i] % (i + 1) != 0 && (i + 1) % p[i] != 0) return;
            count++;
            return;
        }
        for (int i = k; i < p.length; i++) {
            int t = p[k]; p[k] = p[i]; p[i] = t;
            permute(p, k + 1);
            t = p[k]; p[k] = p[i]; p[i] = t;
        }
    }
}
