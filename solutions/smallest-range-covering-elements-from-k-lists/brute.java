class Solution {
    public int[] smallestRange(List<List<Integer>> nums) {
        int[] best = null;
        List<Integer> starts = new ArrayList<>();
        for (List<Integer> l : nums) starts.addAll(l);
        Collections.sort(starts);
        for (int lo : starts) {
            long hi = Long.MIN_VALUE;
            boolean ok = true;
            for (List<Integer> l : nums) {
                int i = 0;
                while (i < l.size() && l.get(i) < lo) i++;          // first element ≥ lo
                if (i == l.size()) { ok = false; break; }
                hi = Math.max(hi, l.get(i));
            }
            if (!ok) break;
            if (best == null || hi - lo < (long) best[1] - best[0]) best = new int[]{lo, (int) hi};
        }
        return best;
    }
}
