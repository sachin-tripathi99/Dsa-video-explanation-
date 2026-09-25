class Solution {
    public int minStoneSum(int[] piles, int k) {
        for (int op = 0; op < k; op++) {
            int m = 0;
            for (int i = 1; i < piles.length; i++) if (piles[i] > piles[m]) m = i;   // scan for the largest
            piles[m] -= piles[m] / 2;
        }
        int total = 0;
        for (int p : piles) total += p;
        return total;
    }
}
