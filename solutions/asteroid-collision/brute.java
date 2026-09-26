class Solution {
    public int[] asteroidCollision(int[] asteroids) {
        List<Integer> a = new ArrayList<>();
        for (int x : asteroids) a.add(x);
        boolean changed = true;
        while (changed) {
            changed = false;
            for (int i = 0; i + 1 < a.size(); i++) {
                int l = a.get(i), r = a.get(i + 1);
                if (l > 0 && r < 0) {                        // they meet
                    if (l > -r) a.remove(i + 1);
                    else if (l < -r) a.remove(i);
                    else { a.remove(i + 1); a.remove(i); }
                    changed = true;
                    break;
                }
            }
        }
        return a.stream().mapToInt(Integer::intValue).toArray();
    }
}
