class Solution {
    public boolean isNStraightHand(int[] hand, int groupSize) {
        if (hand.length % groupSize != 0) return false;
        List<Integer> cards = new ArrayList<>();
        for (int x : hand) cards.add(x);
        Collections.sort(cards);
        while (!cards.isEmpty()) {
            int x = cards.get(0);
            for (int d = 0; d < groupSize; d++) {
                int idx = cards.indexOf(x + d);             // O(n) search + removal
                if (idx < 0) return false;
                cards.remove(idx);
            }
        }
        return true;
    }
}
