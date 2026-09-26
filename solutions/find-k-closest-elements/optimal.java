class Solution {
    public List<Integer> findClosestElements(int[] arr, int k, int x) {
        int lo = 0, hi = arr.length - k;                    // window start in [0, n − k]
        while (lo < hi) {
            int m = (lo + hi) >>> 1;
            if (x - arr[m] > arr[m + k] - x) lo = m + 1;   // a[m] is farther: move right
            else hi = m;
        }
        List<Integer> out = new ArrayList<>();
        for (int i = lo; i < lo + k; i++) out.add(arr[i]);
        return out;
    }
}
