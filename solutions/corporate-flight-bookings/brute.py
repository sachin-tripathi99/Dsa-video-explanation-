class Solution:
    def corpFlightBookings(self, bookings: List[List[int]], n: int) -> List[int]:
        ans = [0] * n
        for first, last, seats in bookings:
            for f in range(first, last + 1):
                ans[f - 1] += seats
        return ans
