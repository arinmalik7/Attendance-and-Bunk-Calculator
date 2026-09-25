/**
 * Attendance & Bunk Calculator
 * High-End SaaS Core Logic, Mathematical Derivations & LocalStorage Persistence
 */

document.addEventListener('DOMContentLoaded', () => {
  const STORAGE_KEY = 'attendance_calc_data';

  // DOM Elements - Form & Controls
  const form = document.getElementById('attendance-form');
  const subjectInput = document.getElementById('subject-name');
  const totalInput = document.getElementById('total-sessions');
  const attendedInput = document.getElementById('attended-sessions');
  const targetInput = document.getElementById('target-attendance');
  const resetBtn = document.getElementById('reset-btn');

  // DOM Elements - Hero Stat Card & Verdict Banner
  const attendedError = document.getElementById('attended-error');
  const currentAttendanceOutput = document.getElementById('current-attendance-output');
  const statusBadge = document.getElementById('status-badge');
  const attendanceProgress = document.getElementById('attendance-progress');
  const targetDisplay = document.getElementById('target-display');
  const verdictBanner = document.getElementById('verdict-banner');
  const verdictOutput = document.getElementById('verdict-output');

  /**
   * Resets results, progress bar, and status indicator to baseline state
   */
  function resetResultsState() {
    currentAttendanceOutput.textContent = '--%';
    statusBadge.className = 'status-indicator status-neutral';
    statusBadge.textContent = 'No Data';

    if (attendanceProgress) {
      attendanceProgress.value = 0;
      attendanceProgress.className = '';
    }

    if (verdictBanner) {
      verdictBanner.className = 'verdict-banner verdict-neutral';
    }

    verdictOutput.textContent = 'Enter your session details above and click Calculate.';
  }

  /**
   * Clears inline validation errors and removes error styling
   */
  function clearErrors() {
    if (attendedError) {
      attendedError.textContent = '';
    }
    attendedInput.classList.remove('input-error');
  }

  /**
   * Displays an inline validation error on the attended sessions input
   * @param {string} message 
   */
  function showAttendedError(message) {
    if (attendedError) {
      attendedError.textContent = message;
    }
    attendedInput.classList.add('input-error');
  }

  /**
   * Auto-Save: Serializes form values to localStorage under attendance_calc_data
   */
  function autoSave() {
    try {
      const bundle = {
        subjectName: subjectInput.value,
        totalSessions: totalInput.value,
        attendedSessions: attendedInput.value,
        targetPercentage: targetInput.value
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bundle));
    } catch (error) {
      console.warn('Unable to access localStorage for auto-saving:', error);
    }
  }

  /**
   * Auto-Load: Restores saved session values from localStorage on page load
   */
  function autoLoad() {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (!savedData) {
        if (targetDisplay) targetDisplay.textContent = '75%';
        return;
      }

      const parsed = JSON.parse(savedData);
      if (parsed && typeof parsed === 'object') {
        if (parsed.subjectName !== undefined) subjectInput.value = parsed.subjectName;
        if (parsed.totalSessions !== undefined) totalInput.value = parsed.totalSessions;
        if (parsed.attendedSessions !== undefined) attendedInput.value = parsed.attendedSessions;
        if (parsed.targetPercentage !== undefined && parsed.targetPercentage !== '') {
          targetInput.value = parsed.targetPercentage;
        } else {
          targetInput.value = '75';
        }

        // Trigger immediate calculation on load
        calculateAttendance();
      }
    } catch (error) {
      console.warn('Unable to restore attendance data from localStorage:', error);
    }
  }

  /**
   * Computes attendance percentages, recovery sessions, and updates UI
   */
  function calculateAttendance() {
    clearErrors();

    const totalRaw = totalInput.value.trim();
    const attendedRaw = attendedInput.value.trim();
    const targetRaw = targetInput.value.trim();

    const target = parseFloat(targetRaw) || 75;
    if (targetDisplay) {
      targetDisplay.textContent = `${target}%`;
    }

    // Edge Case: If total is empty, non-numeric, or <= 0, do not compute (no NaN%)
    if (!totalRaw || isNaN(Number(totalRaw)) || Number(totalRaw) <= 0) {
      resetResultsState();
      return;
    }

    // Edge Case: If attended sessions is not yet provided or non-numeric
    if (attendedRaw === '' || isNaN(Number(attendedRaw))) {
      resetResultsState();
      return;
    }

    const total = parseFloat(totalRaw);
    const attended = parseFloat(attendedRaw);

    // Validation: Attended sessions cannot exceed total scheduled sessions
    if (attended > total) {
      showAttendedError('Attended sessions cannot exceed total sessions.');
      resetResultsState();
      if (verdictBanner) {
        verdictBanner.className = 'verdict-banner verdict-danger';
      }
      verdictOutput.textContent = 'Cannot calculate: attended sessions exceed total sessions.';
      return;
    }

    // Validation: Attended sessions cannot be negative
    if (attended < 0) {
      showAttendedError('Attended sessions cannot be negative.');
      resetResultsState();
      return;
    }

    // 1. Current Attendance % calculation: currentPct = (attended / total) * 100
    const currentPct = (attended / total) * 100;
    const formattedPct = Number.isInteger(currentPct) ? currentPct : currentPct.toFixed(1);
    currentAttendanceOutput.textContent = `${formattedPct}%`;

    // Update Progress Bar value
    if (attendanceProgress) {
      attendanceProgress.value = Math.min(100, Math.max(0, currentPct));
    }

    // 2. Safe Zone: currentPct >= target
    if (currentPct >= target) {
      const targetRatio = target / 100;
      let skippable = Math.floor((attended - (targetRatio * total)) / targetRatio);
      skippable = Math.max(0, skippable);

      // Status Badge: Safe
      statusBadge.className = 'status-indicator status-safe';
      statusBadge.textContent = 'Safe';

      // Progress bar fill style
      if (attendanceProgress) {
        attendanceProgress.className = 'progress-safe';
      }

      // Actionable Insight Alert Pill
      if (verdictBanner) {
        verdictBanner.className = 'verdict-banner verdict-safe';
      }
      verdictOutput.textContent = `You can skip ${skippable} more session(s) while staying above ${target}%.`;
    } 
    // 3. Danger Zone: currentPct < target
    else {
      // Status Badge: Danger Zone
      statusBadge.className = 'status-indicator status-danger';
      statusBadge.textContent = 'Danger Zone';

      // Progress bar fill style
      if (attendanceProgress) {
        attendanceProgress.className = 'progress-danger';
      }

      // Actionable Insight Alert Pill
      if (verdictBanner) {
        verdictBanner.className = 'verdict-banner verdict-danger';
      }

      // Edge case: target is 100% and missed sessions already occurred
      if (target >= 100) {
        verdictOutput.textContent = `Attendance is below ${target}%. Since missed sessions cannot be recovered, 100% attendance cannot be reached.`;
        return;
      }

      // Mathematical derivation:
      // (attended + N) / (total + N) >= target / 100
      // N = Math.ceil(((target * total / 100) - attended) / (1 - (target / 100)))
      const targetRatio = target / 100;
      const neededSessions = Math.ceil(((targetRatio * total) - attended) / (1 - targetRatio));
      const safeNeeded = Math.max(1, neededSessions);

      verdictOutput.textContent = `You need to attend ${safeNeeded} consecutive session(s) to reach ${target}%.`;
    }
  }

  // Auto-Save and real-time computation on form inputs
  form.addEventListener('input', () => {
    autoSave();
    calculateAttendance();
  });

  // Explicit form submission handler
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    calculateAttendance();
    autoSave();
  });

  // Reset / Clear handler: clears form, resets storage, and restores default 75%
  form.addEventListener('reset', () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.warn('Unable to clear localStorage:', error);
    }

    setTimeout(() => {
      targetInput.value = '75';
      if (targetDisplay) targetDisplay.textContent = '75%';
      clearErrors();
      resetResultsState();
    }, 0);
  });

  // Execute Auto-Load on startup
  autoLoad();
});
