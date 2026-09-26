class Solution {
    public int[][] intervalIntersection(int[][] firstList, int[][] secondList) {
        List<int[]> out = new ArrayList<>();
        for (int[] a : firstList)
            for (int[] b : secondList) {
                int lo = Math.max(a[0], b[0]), hi = Math.min(a[1], b[1]);
                if (lo <= hi) out.add(new int[]{lo, hi});
            }
        return out.toArray(new int[0][]);
    }
}
