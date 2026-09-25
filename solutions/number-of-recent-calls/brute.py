class RecentCounter:
    def __init__(self):
        self.all = []

    def ping(self, t: int) -> int:
        self.all.append(t)
        return sum(1 for x in self.all if x >= t - 3000)   # rescan everything
