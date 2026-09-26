class Solution {
    public int minDays(int[] bloomDay, int m, int k) {
        if ((long) m * k > bloomDay.length) return -1;       // not enough flowers ever
        int lo = Integer.MAX_VALUE, hi = 0;
        for (int x : bloomDay) { lo = Math.min(lo, x); hi = Math.max(hi, x); }
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (count(bloomDay, mid, k) >= m) hi = mid;
            else lo = mid + 1;
        }
        return lo;
    }

    private int count(int[] b, int day, int k) {             // bouquets of k adjacent bloomed flowers
        int run = 0, n = 0;
        for (int x : b) {
            if (x <= day) { if (++run == k) { n++; run = 0; } }
            else run = 0;
        }
        return n;
    }
}
