class Solution:
    def canCompleteCircuit(self, gas: List[int], cost: List[int]) -> int:
        total = tank = start = 0
        for i, (g, c) in enumerate(zip(gas, cost)):
            total += g - c
            tank += g - c
            if tank < 0:                        # every start in [start, i] fails
                start, tank = i + 1, 0
        return start if total >= 0 else -1
