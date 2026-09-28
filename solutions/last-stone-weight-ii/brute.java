class Solution {
    private int best = 0, half;

    public int lastStoneWeightII(int[] stones) {
        int total = 0;
        for (int x : stones) total += x;
        half = total / 2;
        search(stones, 0, 0);
        return total - 2 * best;
    }

    private void search(int[] a, int i, int sum) {          // every subset as group B
        if (sum > half) return;
        best = Math.max(best, sum);
        if (i == a.length) return;
        search(a, i + 1, sum + a[i]);
        search(a, i + 1, sum);
    }
}
