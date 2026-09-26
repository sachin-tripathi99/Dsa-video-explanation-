class Solution {
    public List<Integer> findClosestElements(int[] arr, int k, int x) {
        List<Integer> all = new ArrayList<>();
        for (int a : arr) all.add(a);
        all.sort((a, b) -> Math.abs(a - x) != Math.abs(b - x) ? Math.abs(a - x) - Math.abs(b - x) : a - b);
        List<Integer> out = new ArrayList<>(all.subList(0, k));
        Collections.sort(out);
        return out;
    }
}
