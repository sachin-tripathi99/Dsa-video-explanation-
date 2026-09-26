class Solution {
    public int[][] merge(int[][] intervals) {
        List<int[]> list = new ArrayList<>();
        for (int[] x : intervals) list.add(new int[]{x[0], x[1]});
        boolean changed = true;
        while (changed) {
            changed = false;
            search:
            for (int i = 0; i < list.size(); i++)
                for (int j = i + 1; j < list.size(); j++) {
                    int[] a = list.get(i), b = list.get(j);
                    if (a[0] <= b[1] && b[0] <= a[1]) {             // overlap → union
                        a[0] = Math.min(a[0], b[0]);
                        a[1] = Math.max(a[1], b[1]);
                        list.remove(j);
                        changed = true;
                        break search;
                    }
                }
        }
        list.sort((a, b) -> Integer.compare(a[0], b[0]));
        return list.toArray(new int[0][]);
    }
}
