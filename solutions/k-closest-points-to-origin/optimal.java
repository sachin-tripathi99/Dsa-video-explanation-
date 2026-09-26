class Solution {
    public int[][] kClosest(int[][] points, int k) {
        int lo = 0, hi = points.length - 1;
        Random rnd = new Random(7);
        while (lo < hi) {
            int p = lo + rnd.nextInt(hi - lo + 1);
            swap(points, p, hi);                             // random pivot to the end
            int piv = d(points[hi]), s = lo;
            for (int i = lo; i < hi; i++) if (d(points[i]) < piv) swap(points, i, s++);
            swap(points, s, hi);                             // pivot at its sorted position s
            if (s == k) break;
            if (s < k) lo = s + 1; else hi = s - 1;
        }
        return Arrays.copyOf(points, k);
    }

    private int d(int[] p) { return p[0] * p[0] + p[1] * p[1]; }

    private void swap(int[][] a, int i, int j) { int[] t = a[i]; a[i] = a[j]; a[j] = t; }
}
