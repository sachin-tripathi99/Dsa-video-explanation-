class Solution {
    public int lastStoneWeight(int[] stones) {
        List<Integer> a = new ArrayList<>();
        for (int s : stones) a.add(s);
        while (a.size() > 1) {
            Collections.sort(a);
            int y = a.remove(a.size() - 1), x = a.remove(a.size() - 1);
            if (y != x) a.add(y - x);
        }
        return a.isEmpty() ? 0 : a.get(0);
    }
}
