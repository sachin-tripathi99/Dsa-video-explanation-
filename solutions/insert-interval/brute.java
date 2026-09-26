class Solution {
    public int[][] insert(int[][] intervals, int[] newInterval) {
        List<int[]> all = new ArrayList<>();
        for (int[] x : intervals) all.add(new int[]{x[0], x[1]});
        all.add(new int[]{newInterval[0], newInterval[1]});
        all.sort((a, b) -> Integer.compare(a[0], b[0]));
        List<int[]> out = new ArrayList<>();
        for (int[] c : all) {
            if (!out.isEmpty() && c[0] <= out.get(out.size() - 1)[1])
                out.get(out.size() - 1)[1] = Math.max(out.get(out.size() - 1)[1], c[1]);
            else out.add(c);
        }
        return out.toArray(new int[0][]);
    }
}
