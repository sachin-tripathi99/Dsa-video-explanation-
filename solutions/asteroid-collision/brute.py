class Solution:
    def asteroidCollision(self, asteroids: List[int]) -> List[int]:
        a = list(asteroids)
        changed = True
        while changed:
            changed = False
            for i in range(len(a) - 1):
                l, r = a[i], a[i + 1]
                if l > 0 and r < 0:             # they meet
                    if l > -r:
                        del a[i + 1]
                    elif l < -r:
                        del a[i]
                    else:
                        del a[i:i + 2]
                    changed = True
                    break
        return a
