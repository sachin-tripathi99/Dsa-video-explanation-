class Solution {
    public boolean isNStraightHand(int[] hand, int groupSize) {
        if (hand.length % groupSize != 0) return false;
        TreeMap<Integer, Integer> cnt = new TreeMap<>();
        for (int x : hand) cnt.merge(x, 1, Integer::sum);
        for (int x : cnt.keySet()) {                         // increasing order
            int m = cnt.get(x);
            if (m == 0) continue;
            for (int d = 0; d < groupSize; d++) {            // m groups start at x
                int have = cnt.getOrDefault(x + d, 0);
                if (have < m) return false;
                cnt.put(x + d, have - m);
            }
        }
        return true;
    }
}
