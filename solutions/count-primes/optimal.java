class Solution {
    public int countPrimes(int n) {
        if (n < 3) return 0;
        boolean[] composite = new boolean[n];
        for (int p = 2; (long) p * p < n; p++) {
            if (composite[p]) continue;
            for (int m = p * p; m < n; m += p) composite[m] = true;  // cross out multiples
        }
        int count = 0;
        for (int x = 2; x < n; x++) if (!composite[x]) count++;
        return count;
    }
}
