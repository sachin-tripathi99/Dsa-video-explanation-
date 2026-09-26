class Solution {
    public int canCompleteCircuit(int[] gas, int[] cost) {
        int n = gas.length;
        for (int s = 0; s < n; s++) {
            int tank = 0;
            boolean ok = true;
            for (int k = 0; k < n && ok; k++) {
                int i = (s + k) % n;
                tank += gas[i] - cost[i];
                if (tank < 0) ok = false;
            }
            if (ok) return s;
        }
        return -1;
    }
}
